require 'google/cloud/vision'
require 'base64'
require 'json'

class ImageAnalysesJob < ApplicationJob
  queue_as :default

  def perform(post_id)
    post = Post.find(post_id)

    # 環境変数から認証情報をデコードし、Google Cloud APIに設定
    credentials_json = Base64.decode64(ENV['GOOGLE_CREDENTIALS_ENCODED'])
    credentials_hash = JSON.parse(credentials_json)
    Google::Cloud::Vision.configure do |config|
      config.credentials = credentials_hash
    end

    vision = Google::Cloud::Vision.image_annotator

    post.images.each do |image|
      response = vision.label_detection(image: image.image_file.url, max_results: 2)
      labels = response.responses.map(&:label_annotations).flatten
      labels_data = labels.map(&:description)

      AnalysisResult.create!(
        post: post,
        image: image,
        detected_labels: labels_data
      )
    end
  rescue Google::Cloud::Error => e
    Rails.logger.error "Google Cloud Vision API Error: #{e.message}"
  rescue StandardError => e
    Rails.logger.error "Error in ImageAnalysesJob: #{e.message}"
  end
end
