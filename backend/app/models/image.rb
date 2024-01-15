class Image < ApplicationRecord
  belongs_to :post

  mount_uploader :image_file, PostImageUploader
end
