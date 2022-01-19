class SendMediaService {
    sendMediaEndpoint = process.env.REACT_APP_SEND_MEDIA_ENDPOINT;

    constructor(manager) {
        this.manager = manager;
    }

    async sendMedia(file, channelSid, channelDefinition, task) {
        try {
            const channel = await this.manager.chatClient.getChannelBySid(channelSid);
            const members = channel.membersEntity.members;

            // This listener isn't defined to listen to every message on the ComponentDidMount method to avoid
            // sending duplicated media when there is more than one tab of Flex open in the user's browser
            channel.once('messageAdded', async (msg) => {
                const { media, memberSid } = msg;
                const loggedMember = members.get(memberSid);

                if (memberSid === loggedMember.sid && media) {
                    const mediaUrl = await media.getContentUrl();
                    await this.sendMediaMessage(mediaUrl, channelDefinition, task);
                }
            });

            await channel.sendMessage({
                contentType: file.type,
                media: file,
            });
        } catch (err) {
            console.error('Error while sending media', err);
            return;
        }
    }

    async sendMediaMessage(mediaUrl, channelDefinition, task) {
        const { name: to } = task.attributes;

        const body = {
            mediaUrl,
            to,
            channel: channelDefinition.name,
            Token: this.manager.store.getState().flex.session.ssoTokenPayload.token,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(body),
        };

        try {
            const response = await fetch(this.sendMediaEndpoint, options);
            const json = await response.json();
            console.log(`[SendMediaService] Media message was set to ${to}`, json);
        } catch (err) {
            console.error(`Error when sending media message to ${to}`, err);
        }
    }
}

export default SendMediaService;
