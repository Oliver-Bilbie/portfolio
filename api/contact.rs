use aws_config::{load_defaults, BehaviorVersion};
use aws_sdk_sesv2 as ses;
use lambda_http::{run, service_fn, Body, Error, Request, Response};
use serde::Deserialize;
use serde_json::json;

#[derive(Deserialize)]
struct ContactRequest {
    contact_email: String,
    message: String,
}

struct ContactResponse {
    status: u16,
    message: String,
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
    let result = contact(event).await;

    let response = match result {
        Ok(_) => ContactResponse {
            status: 200,
            message: "Message sent successfully".to_string(),
        },

        Err(err) => {
            tracing::error!("Contact handler failed: {:?}", err);
            ContactResponse {
                status: 400,
                message: err.to_string(),
            }
        }
    };

    Ok(Response::builder()
        .status(response.status)
        .header("content-type", "application/json")
        .body(json!({ "message": response.message }).to_string().into())
        .map_err(Box::new)?)
}

async fn contact(event: Request) -> Result<(), Error> {
    let body = read_event_body(event)?;
    let contact_email = body.contact_email;
    let message = body.message;

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
) -> Result<(), Error> {
    let mut destination: ses::types::Destination = ses::types::Destination::builder().build();
    destination.to_addresses = Some(vec![target_email]);

    let subject_content = ses::types::Content::builder()
        .data(format!("Message from {}", contact_email))
        .charset("UTF-8")
        .build()?;

    let body_content = ses::types::Content::builder()
        .data(message)
        .charset("UTF-8")
        .build()?;

    let body = ses::types::Body::builder().text(body_content).build();

    let message = ses::types::Message::builder()
        .subject(subject_content)
        .body(body)
        .build();

    let email_content = ses::types::EmailContent::builder().simple(message).build();

    ses_client
        .send_email()
        .from_email_address("Portfolio Site <hello@oliver-bilbie.co.uk>")
        .destination(destination)
        .content(email_content)
        .send()
        .await?;

    Ok(())
}

fn read_event_body(event: Request) -> Result<ContactRequest, Error> {
    let body = match event.body() {
        Body::Text(text) => serde_json::from_str(text)?,
        Body::Binary(input) => {
            let text = String::from_utf8(input.to_vec())?;
            serde_json::from_str(&text)?
        }
        _ => return Err("No event body was provided".into()),
    };
    Ok(body)
}
