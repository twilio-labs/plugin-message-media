const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async function(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { to, mediaUrl } = event;
  const channel = event.channel && event.channel.toLowerCase();
  const client = context.getTwilioClient();

  const channelsFrom = {
    'chat-whatsapp': `whatsapp:${context.TWILIO_WHATSAPP_NUMBER}`,
    'chat-sms': context.TWILIO_SMS_NUMBER
  };

  const from = channelsFrom[channel];

  if (!from) {
    console.warn('invalid channel: ', channel);
    response.setStatusCode(400);
    response.setBody(
      JSON.stringify({ success: false, msg: 'invalid channel' })
    );
    return callback(null, response);
  }

  try {
    const result = await client.messages.create({
      from,
      to,
      mediaUrl
    });
    console.log('message create result:', result);
    response.setBody(JSON.stringify({ success: true }));
    callback(null, response);
  } catch (error) {
    console.error('error creating message:', error);
    response.setBody(JSON.stringify({ success: false, error }));
    callback(response, null);
  }
});
