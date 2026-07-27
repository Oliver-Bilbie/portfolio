use aws_config::{load_defaults, BehaviorVersion};
use aws_sdk_sesv2 as ses;
use lambda_http::{http::StatusCode, run, service_fn, Body, Error, Request, Response};
use serde::Deserialize;
use serde_json::json;
use std::error::Error as StdError;
use std::fmt;

#[derive(Deserialize)]
struct ContactRequest {
    contact_email: String,
    message: String,
}

#[derive(Debug)]
enum ContactError {
    InvalidRequest(&'static str),
    Internal(Box<dyn StdError + Send + Sync>),
}

impl ContactError {
    fn internal(err: impl StdError + Send + Sync + 'static) -> Self {
        Self::Internal(Box::new(err))
    }
}

impl fmt::Display for ContactError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidRequest(msg) => write!(f, "{msg}"),
            Self::Internal(err) => write!(f, "{err}"),
        }
    }
}

impl StdError for ContactError {
    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        match self {
            Self::InvalidRequest(_) => None,
            Self::Internal(err) => Some(err.as_ref()),
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(handle_response)).await
}

async fn handle_response(event: Request) -> Result<Response<Body>, Error> {
    let (status, message) = match contact(event).await {
        Ok(()) => (StatusCode::OK, "Message sent successfully"),
        Err(ContactError::InvalidRequest(message)) => (StatusCode::BAD_REQUEST, message),
        Err(err @ ContactError::Internal(_)) => {
            tracing::error!("Contact handler failed: {err:?}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "An internal error occurred",
            )
        }
    };

    Ok(Response::builder()
        .status(status)
        .header("content-type", "application/json")
        .body(json!({ "message": message }).to_string().into())
        .map_err(Box::new)?)
}

async fn contact(event: Request) -> Result<(), ContactError> {
    let body = read_event_body(event)?;
    let contact_email = body.contact_email.trim().to_string();
    let message = body.message.trim().to_string();

    if contact_email.is_empty() || message.is_empty() {
        return Err(ContactError::InvalidRequest(
            "Invalid request: email and message are required",
        ));
    }

    if !contact_email.contains('@') || contact_email.len() > 254 {
        return Err(ContactError::InvalidRequest(
            "Invalid request: email is invalid",
        ));
    }

    if message.len() > 10000 {
        return Err(ContactError::InvalidRequest(
            "Invalid request: message is too long",
        ));
    }

    let aws_config = load_defaults(BehaviorVersion::latest()).await;
    let ses_client = ses::Client::new(&aws_config);

    let target_email: String = env!(
        "MY_EMAIL",
        "No target email address was provided by the environment"
    )
    .into();

    send_email(&ses_client, target_email, contact_email, message).await?;

    Ok(())
}

async fn send_email(
    ses_client: &ses::Client,
    target_email: String,
    contact_email: String,
    message: String,
) -> Result<(), ContactError> {
    let mut destination: ses::types::Destination = ses::types::Destination::builder().build();
    destination.to_addresses = Some(vec![target_email]);

    let subject_content = ses::types::Content::builder()
        .data(format!("Message from {}", contact_email))
        .charset("UTF-8")
        .build()
        .map_err(ContactError::internal)?;

    let body_content = ses::types::Content::builder()
        .data(message)
        .charset("UTF-8")
        .build()
        .map_err(ContactError::internal)?;

    let body = ses::types::Body::builder().text(body_content).build();

    let message = ses::types::Message::builder()
        .subject(subject_content)
        .body(body)
        .build();

    let email_content = ses::types::EmailContent::builder().simple(message).build();

    ses_client
        .send_email()
        .from_email_address("Portfolio Site <hello@oliver-bilbie.co.uk>")
        .reply_to_addresses(contact_email)
        .destination(destination)
        .content(email_content)
        .send()
        .await
        .map_err(ContactError::internal)?;

    Ok(())
}

fn read_event_body(event: Request) -> Result<ContactRequest, ContactError> {
    let body = match event.body() {
        Body::Text(text) => serde_json::from_str(text).map_err(ContactError::internal)?,
        Body::Binary(input) => {
            let text = String::from_utf8(input.to_vec()).map_err(ContactError::internal)?;
            serde_json::from_str(&text).map_err(ContactError::internal)?
        }
        _ => {
            return Err(ContactError::InvalidRequest(
                "Invalid request: no event body was provided",
            ))
        }
    };
    Ok(body)
}
