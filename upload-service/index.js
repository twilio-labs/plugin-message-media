'use strict';

const cors = require('cors');
const express = require('express');
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = require('express-pino-logger')({
  logger,
  useLevel: 'debug'
});
const multer = require('multer');
const fetch = require('node-fetch');
const VError = require('verror');

const { flexAuth } = require('./middlewares/flex-token-auth');

const requestError = async (res, message) => {
  return new VError(
    {
      info: {
        status: res.status,
        statusText: res.statusText,
        body: await res.text()
      }
    },
    message
  );
};

const uploadMediaToMCS = async file => {
  try {
    const res = await fetch(
      `https://mcs.us1.twilio.com/v1/Services/${process.env.CHAT_SERVICE_SID}/Media`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.ACCOUNT_SID + ':' + process.env.AUTH_TOKEN
          ).toString('base64')}`,
          'Content-Type': file.mimetype
        },
        body: file.buffer
      }
    );

    if (!res.ok) {
      throw await requestError(
        res,
        'Request error when posting the media to MCS'
      );
    }

    return await res.json();
  } catch (err) {
    throw new VError(err, 'Error while uploading the media to MCS');
  }
};

const fetchMediaDetails = async media => {
  try {
    const res = await fetch(
      `https://mcs.us1.twilio.com/v1/Services/${process.env.CHAT_SERVICE_SID}/Media/${media.sid}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.ACCOUNT_SID + ':' + process.env.AUTH_TOKEN
          ).toString('base64')}`
        }
      }
    );

    if (!res.ok) {
      throw await requestError(
        res,
        'Request error while fetching media details on MCS'
      );
    }

    return await res.json();
  } catch (err) {
    throw new VError(err, 'Error while fetching the uploaded media details');
  }
};

(async () => {
  const app = express();
  const upload = multer();

  app.use(cors());
  app.use(expressLogger);
  app.use(flexAuth);

  app.post('/upload', upload.single('media'), async (req, res) => {
    const acceptedMediaTypes = [
      'image/jpeg',
      'image/png',
      'audio/mp3',
      'audio/mpeg',
      'audio/ogg',
      'audio/amr',
      'video/mp4',
      'application/pdf'
    ];

    const { file } = req;

    if (!acceptedMediaTypes.includes(file.mimetype)) {
      console.log(file.mimetype);
      return res.status(415).json({ msg: 'media not supported' });
    }

    try {
      const media = await uploadMediaToMCS(file);
      const mediaDetails = await fetchMediaDetails(media);

      const {
        sid: mediaSid,
        content_type: mediaType,
        date_created: dateCreated
      } = media;

      const {
        links: { content_direct_temporary: mediaUrl }
      } = mediaDetails;

      res.json({
        dateCreated,
        mediaType,
        mediaSid,
        mediaUrl
      });
    } catch (err) {
      logger.error(
        'An internal error occurred on POST /upload endpoint: %o',
        err
      );
      res.status(500).send({ msg: 'An internal error occurred.' });
    }
  });

  app.listen(process.env.PORT, () => {
    logger.info(`Server running at port ${process.env.PORT}`);
  });
})();
