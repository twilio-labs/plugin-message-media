const VError = require('verror');

const getApiUtils = (context) => {
  const client = context.getTwilioClient();

  return {
    fetchSubresourcesList: async (messageSid) => {
      try {
        return await client
          .messages(messageSid)
          .media.list({ limit: 1 });
      } catch (err) {
        throw new VError(err, "error while fetching message's subResources list");
      }
    },
    fetchSession: async (sessionSid) => {
      try {
        return await client.proxy
          .services(context.PROXY_SERVICE)
          .sessions(sessionSid)
          .fetch();
      } catch (err) {
        throw new VError(err, "error while fecthing Proxy's session details");
      }
    },
    updateChatMessageMedia: async (channelSid, messageSid, data) => {
      try {
        return await client.chat
          .services(context.CHAT_SERVICE_SID)
          .channels(channelSid)
          .messages(messageSid)
          .update(data);
      } catch (err) {
        throw new VError(err, "error while updating Chat's message with incoming media");
      }
    }
  }
}

const updateFlexChatMessageWithMMSMedia = async (context, event) => {
  const { fetchSession, fetchSubresourcesList, updateChatMessageMedia } = getApiUtils(context);

  const sessionSid = event.interactionSessionSid;
  const messageSid = event.outboundResourceSid;

  const subResourcesList = await fetchSubresourcesList(event.inboundResourceSid);

  if (subResourcesList.length) {
    const [subResource] = subResourcesList;
    const mediaType = subResource.contentType;
    const mediaURL =
      'https://api.twilio.com' + subResource.uri.replace('.json', '');

    const session = await fetchSession(sessionSid);
    const channelSid = session.uniqueName.split('.')[0];
  
    const updatedChatMessage = await updateChatMessageMedia(channelSid, messageSid, {
      attributes: JSON.stringify({
        mediaType,
        media: mediaURL,
      })
    });

    console.log(updatedChatMessage);
  } else {
    console.log('Message is a MMS, but it doesn\'t have any media attached.')
  }
}

exports.handler = async function(context, event, callback) {
  if (event.inboundResourceSid.includes('MM')) {
    try {
      await updateFlexChatMessageWithMMSMedia(context, event);
      callback(null);
    } catch (err) {
      console.error('An unexpected error occurred: ', err);
      callback(err);
    }
  } else {
    console.log('not MMS');
    callback(null);
  }
};
