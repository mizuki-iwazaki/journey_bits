class Post < ApplicationRecord
  belongs_to :user
  belongs_to :theme

  validates :content, presence: true, length: { maximum: 65_535 }
  validates :theme_id, presence: true

  enum status: { published: 0, restricted: 1 }
end
