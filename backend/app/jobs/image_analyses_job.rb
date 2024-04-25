require 'google/cloud/vision'

class ImageAnalysesJob < ApplicationJob
  queue_as :default

  def perform(post_id)
    post = Post.find(post_id)

    vision = Google::Cloud::Vision.image_annotator

    post.images.each do |image|
      # CloudinaryのURLを直接Google Cloud Vision APIに渡す
      response = vision.label_detection(image: image.image_file.url, max_results: 2)

      # 解析結果を取得
      labels = response.responses.map(&:label_annotations).flatten

      # 解析結果に基づいてAnalysisResultを作成、JSON形式で保存
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
