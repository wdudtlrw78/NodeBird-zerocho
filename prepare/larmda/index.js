// lambda는 알아서 사용자 정보들을 가져오기 때문에 Key를 안넣어줘도 된다.
// sharp, aws-sdk 공식문서 참고

const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

// s3에다가 이미지를 멀터로 업로드할 때 larmda랑 같이 실행한다.
// event에 s3업로드 이벤트가 들어있다.
exports.handler = (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // react-nodemomobird-s3
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/123123_abc.png
  console.log(Bucket, Key);
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename', filename, 'ext', ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key}).promise();
    console.log('original', s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .resize(400, 400, { fit: 'inside' })
      .toFormat(requiredFormat)
      .toBuffer();
    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage,
    }).promise();
    console.log('put', resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error)
    return callback(error);
  }
};
