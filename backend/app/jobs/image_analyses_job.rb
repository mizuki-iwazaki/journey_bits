require 'google/cloud/vision'

class ImageAnalysesJob < ApplicationJob
  queue_as :default

  def perform(post_id)
    # 環境変数から認証情報を自動的に読み込む
    vision = Google::Cloud::Vision.image_annotator

    post = Post.find(post_id)
    post.images.each do |image|
      # 画像解析を行う
      response = vision.label_detection image: image.image_file.url, max_results: 2

      # 解析結果を取得
      labels = response.responses.map(&:label_annotations).flatten

      # 解析結果に基づいてAnalysisResultを作成、JSON形式で保存
      labels_data = labels.map(&:description)
      AnalysisResult.create!(
        post: post,
        image: image,
        detected_labels: labels_data,
      )
    end
  rescue Google::Cloud::Error => e
    Rails.logger.error "Google Cloud Vision APIエラー: #{e.message}"
  end
end
