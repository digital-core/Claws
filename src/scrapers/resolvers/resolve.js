const {Openload} = require('./Openload');
const {Streamango} = require('./Streamango');
const RapidVideo = require('./RapidVideo');
const AZMovies = require('./AZMovies');
const Vidlox = require('./Vidlox');
const {VShare} = require('./VShare');
const SpeedVid = require('./SpeedVid');
const VidCloud = require('./VidCloud');
const ClipWatching = require('./ClipWatching');
const EStream = require('./EStream');
// const Vidzi = require('./Vidzi');
const VidTodo = require('./VidTodo');
const {PowVideo} = require('./PowVideo');
const {GamoVideo} = require('./GamoVideo');
const GorillaVid = require('./GorillaVid');
const DaClips = require('./DaClips');
const MovPod = require('./MovPod');
const {Vidoza} = require('./Vidoza');
const StreamM4u = require('./StreamM4u');
const {GoogleDrive, getGoogleDriveScrapeUrl} = require('./GoogleDrive');
const MovieFiles = require('./MovieFiles');
const EnterVideo = require('./EnterVideo');
const logger = require('../../utils/logger');

const createEvent = require('../../utils/createEvent');

async function resolve(sse, uri, source, jar, headers, quality = '') {
    if (sse.stopExecution) {
        logger.debug('Skip resolve due to disconnect');
        return;
    }

    logger.debug(`resolving: ${uri}`);

    const ipLocked = process.env.CLAWS_ENV === 'server';

    try {
        if (uri.includes('openload.co') || uri.includes('oload.cloud')) {
            const path = uri.split('/');
            const videoId = path[4];
            if (!uri.includes('embed')) {
                uri = `https://openload.co/embed/${videoId}`;
            }
            let data;
            if (!ipLocked) {
                data = await Openload(uri, jar, headers);
            }
            const event = await createEvent(data, ipLocked, {url: 'https://olpair.com', videoId, target: uri}, {quality, provider: 'Openload', source});
            sse.send(event, event.event);

        } else if (uri.includes('streamango.com')) {
            let data;
            if (!ipLocked) {
                data = await Streamango(uri, jar, headers);
            }
            const event = await createEvent(data, ipLocked, {target: uri}, {quality, provider: 'Streamango', source});
            sse.send(event, event.event);

        } else if (uri.includes('rapidvideo.com')) {
            const data = await RapidVideo(uri, jar);
            const event = await createEvent(data, false, undefined, {quality, provider: 'RapidVideo', source});
            sse.send(event, event.event);

        } else if (uri.includes('azmovies.co') || uri.includes('azmovies.ws')) {
            const file = await AZMovies(uri, jar, headers);
            const event = await createEvent(file, false, undefined, {quality, provider: 'AZMovies', source});
            sse.send(event, event.event);

        } else if (uri.includes('vidlox.me') || uri.includes('vidlox.tv')) {
            const dataList = await Vidlox(uri, jar, headers);
            for (const data of dataList) {
                const event = await createEvent(data, false, undefined, {quality, provider: 'Vidlox', source}, {referer: uri});
                sse.send(event, event.event);
            }

        } else if (uri.includes('vshare.eu')) {
            const path = uri.split('/');
            let videoId = path[path.length - 1].replace('.html', '');
            if (!uri.includes('embed')) {
                videoId = path[path.length - 1].replace('.htm', '');
                uri = `https://vshare.eu/embed-${videoId}.html`;
            }
            let data;
            if (!ipLocked) {
                data = await VShare(uri, jar, headers);
            }
            const event = await createEvent(data, ipLocked, {url: 'https://vshare.eu/pair', videoId, target: uri}, {quality, provider: 'VShare', source});
            sse.send(event, event.event);

        } else if (uri.includes('speedvid.net')) {
            if (!uri.includes('embed')) {
                const path = uri.split('/');
                const videoId = path[path.length - 1];
                uri = `http://speedvid.net/embed-${videoId}.html`;
            }
            const dataList = await SpeedVid(uri, jar, headers);
            for (const data of dataList) {
                const event = await createEvent(data, false, undefined, {quality, provider: 'SpeedVid', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('vidcloud.co')) {
            if (!uri.includes('player?fid=')) {
                const path = uri.split('/');
                const videoId = path[path.length - 2];
                uri = `https://vidcloud.co/player?fid=${videoId}&page=video`;
            }
            const dataObjects = await VidCloud(uri, jar, headers);
            for(dataObject of dataObjects){
                const event = await createEvent(!!dataObject.file ? dataObject.file : dataObject.link, false, undefined, {quality, provider: 'VidCloud', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('clipwatching.com')) {
            const dataObjects = await ClipWatching(uri, jar, headers);
            for (const dataObject of dataObjects) {
                const event = await createEvent(dataObject.file, false, undefined, {quality: dataObject.label || quality, provider: 'ClipWatching', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('estream.to') || uri.includes('estream.xyz')) {
            // const path = uri.split('/');
            // const videoId = path[path.length - 1];
            // const videoSourceUrls = await EStream(`http://estream.xyz/embed-${videoId}`, jar, clientIp, userAgent);
            // videoSourceUrls.forEach(source => sse.send({videoSourceUrl: source, url, provider: 'http://estream.xyz'}, 'result'));
            // // All the links are broken...

        } else if (uri.includes('vidzi.online')) {
            // const sources = await Vidzi(uri, jar, clientIp, userAgent);
            // sources.forEach((source) => sse.send({videoSourceUrl: source.file, url, provider: 'https://vidzi.online'}, 'result'));
            // // All the links are broken...

        } else if (uri.includes('vidto.me')) {
            // console.log('Skipping vidto.me because the links are always broken.');

        } else if (uri.includes('vidup.me') || uri.includes('vidup.tv') || uri.includes('thevideo.me') || uri.includes('vev.io') || uri.includes('vidup.io')) {
            // console.log('Skipping vidup.me because captcha');

        } else if (uri.includes('vidtodo.me') || uri.includes('vidtodo.com') || uri.includes('vidstodo.me')) {
            const dataObjects = await VidTodo(uri, jar, headers);
            for (const dataObject of dataObjects) {
                const event = await createEvent(dataObject.file, false, undefined, {quality: dataObject.label || quality, provider: 'VidTodo', source}, {referer: uri.replace('vidtodo.me', 'vidstodo.me')});
                sse.send(event, event.event);
            }

        } else if (uri.includes('powvideo.net')) {
            const path = uri.split('/');
            let videoId = path[path.length - 1].replace('iframe-', '').replace('-954x562.html', '');
            if (!uri.includes('iframe')) {
                videoId = path[path.length - 1];
                uri = `https://povwideo.cc/iframe-${videoId}-954x562.html`;
            }
            let dataObjects = [];
            if (!ipLocked) {
                dataObjects = await PowVideo(uri, jar, headers, videoId);
                for (const dataObject of dataObjects) {
                    const event = await createEvent(!!dataObject.file ? dataObject.file : dataObject.link, false, undefined, {quality, provider: 'PowVideo', source});
                    sse.send(event, event.event);
                }
            } else {
                const event = await createEvent(undefined, true, {target: uri, headers: {referer: `https://povwideo.cc/preview-${videoId}-954x562.html`}}, {quality, provider: 'PowVideo', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('streamplay.to')) {
            // console.log('Skipping streamplay.to because captcha.');

        } else if (uri.includes('gamovideo.com')) {
            let dataList = [];
            if (!ipLocked) {
                dataList = await GamoVideo(uri, jar, headers);
                for (const data of dataList) {
                    const event = await createEvent(data, false, undefined, {quality, provider: 'GamoVideo', source});
                    sse.send(event, event.event);
                }
            } else {
                const event = await createEvent(undefined, true, {target: uri}, {quality, provider: 'GamoVideo', source});
                sse.send(event, event.event);
            }


        } else if (uri.includes('gorillavid.com') || uri.includes('gorillavid.in')) {
            const dataObjects = await GorillaVid(uri, jar, headers);
            for (const dataObject of dataObjects) {
                const event = await createEvent(dataObject.src, false, undefined, {quality, provider: 'GorillaVid', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('daclips.com') || uri.includes('daclips.in')) {
            const dataObjects = await DaClips(uri, jar, headers);
            for (const dataObject of dataObjects) {
                const event = await createEvent(dataObject.src, false, undefined, {quality, provider: 'DaClips', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('movpod.com') || uri.includes('movpod.in')) {
            const dataObjects = await MovPod(uri, jar, headers);
            for (const dataObject of dataObjects) {
                const event = await createEvent(dataObject.src, false, undefined, {quality, provider: 'MovPod', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('vidoza.net')) {
            if (!uri.includes('embed')) {
                const path = uri.split('/');
                const videoId = path[3].replace('.html', '');
                uri = `https://vidoza.net/embed-${videoId}.html`;
            }
            let dataObjects = [];
            if (!ipLocked) {
                dataObjects = await Vidoza(uri, jar, headers);
                for (const dataObject of dataObjects) {
                    const event = createEvent(dataObject.src, false, undefined, {quality: dataObject.res || quality, provider: 'Vidoza', source});
                    sse.send(event, event.event);
                }
            } else {
                const event = createEvent(undefined, true, {target: uri}, {quality, provider: 'Vidoza', source});
                sse.send(event, event.event);
            }

        } else if (uri.includes('streamm4u.com')) {
            let link = await StreamM4u(uri, jar, headers);
            resolve(sse, link, source, jar, headers, quality);

        // TODO: Commenting this out until header/cookie support exists for the player.
        } else if (uri.includes('drive.google.com')) {
            uri = getGoogleDriveScrapeUrl(uri);
            let dataObjects = [];
            if (!ipLocked) {
                dataObjects = await GoogleDrive(uri, jar, headers);
                const cookieObjects = jar.getCookies('https://drive.google.com');
                const cookieObject = cookieObjects ? cookieObjects.find(c => c.key === 'DRIVE_STREAM') : {};
                const cookieValue = cookieObject ? cookieObject.value : false;
                const cookie = cookieValue ? `DRIVE_STREAM=${cookieValue}` : undefined;
                for (const dataObject of dataObjects) {
                    const event = await createEvent(dataObject.link, false, undefined, {quality: dataObject.quality || quality, provider: 'GoogleDrive', source, cookie});
                    sse.send(event, event.event);
                }
            } else {
                const event = await createEvent(undefined, true, {target: uri}, {quality, provider: 'GoogleDrive', source, cookieRequired: 'DRIVE_STREAM'});
                sse.send(event, event.event);
            }

        } else if (uri.includes('moviefiles.org')) {
            const data = await MovieFiles(uri, jar, headers);
            const event = await createEvent(data, false, undefined, {quality, provider: 'MovieFiles', source, isDownload: true});
            sse.send(event, event.event);

       /* } else if (uri.includes('entervideo.net')) {
            const data = await EnterVideo(uri, jar, headers);
            const event = await createEvent(data, false, undefined, {quality, provider: 'EnterVideo', source});
            sse.send(event, event.event);*/
        } else {
            logger.warn({source, providerUrl: uri, warning: 'Missing resolver'});
        }
    } catch(err) {
        logger.error({source, providerUrl: uri, error: (err.message || err.toString()).substring(0, 100) + '...'});
    }
}

module.exports = exports = resolve;