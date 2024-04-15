class Image < ApplicationRecord
  belongs_to :post
  has_many :analysis_results, dependent: :destroy

  mount_uploader :image_file, PostImageUploader
end
