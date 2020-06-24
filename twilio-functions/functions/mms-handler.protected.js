exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();
  
  let SESSION_SID;
  let CHANNEL_SID;
  let mediaType;
  let mediaURL;
  let MESSAGE_SID;

  if (event.inboundResourceSid.includes("MM")) {
    console.log(event);
    SESSION_SID = event.interactionSessionSid;
    MESSAGE_SID = event.outboundResourceSid;

    const inboundResource = await client.messages(event.inboundResourceSid).fetch();

    // Check if the message has any media
    console.log("resource is:");
    console.log(inboundResource);

    if (inboundResource.subresourceUris && inboundResource.subresourceUris.media) {
      const subResourceMediaURL = `https://${context.ACCOUNT_SID}:${
        context.AUTH_TOKEN
      }@api.twilio.com${inboundResource.subresourceUris.media}`;

      console.log(subResourceMediaURL);

      const subResourcesList = await client.messages(event.inboundResourceSid)
        .media
        .list({ limit: 1 });
    
      if (subResourcesList.length) {
        const [subResource] = subResourcesList;
        mediaType = subResource.contentType;
        console.log('media content type:', mediaType);
        mediaURL =
          "https://api.twilio.com" +
          subResource.uri.replace(".json", "");

        console.log("this is the media Url " + mediaURL);

        const session = await client.proxy.services(context.PROXY_SERVICE)
            .sessions(SESSION_SID)
            .fetch();

        console.log(session);
        CHANNEL_SID = session.uniqueName.split('.')[0];

        const updatedChatMessage = await client.chat.services(context.CHAT_SERVICE_SID)
           .channels(CHANNEL_SID)
           .messages(MESSAGE_SID)
           .update({ attributes: `{"media": "${mediaURL}", "mediaType": "${mediaType}"}` })
        
        console.log(updatedChatMessage);
      }
      
      callback(null);
    } else {
      console.log("this happened");
      callback(null);
    }
  } else {
    console.log("not MMS");
    callback(null);
  }
};
