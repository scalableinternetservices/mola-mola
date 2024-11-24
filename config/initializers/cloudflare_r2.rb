require 'aws-sdk-s3'

Aws.config.update({
  region: 'auto',
  credentials: Aws::Credentials.new(
    ENV['R2_ACCESS_KEY_ID'],
    ENV['R2_SECRET_ACCESS_KEY']
  )
})

R2_CLIENT = Aws::S3::Client.new(
  endpoint: "https://#{ENV['R2_ENDPOINT']}.r2.cloudflarestorage.com",
  force_path_style: true
)
R2_BUCKET = 'mola-mola'