class Post < ApplicationRecord
  belongs_to :user
  belongs_to :theme
  has_many :images, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :analysis_results, dependent: :destroy
  has_one :location, dependent: :destroy
  accepts_nested_attributes_for :location
  acts_as_taggable_on :tags

  validates :content, presence: true, length: { maximum: 65_535 }
  validates :theme_id, presence: true

  enum status: { published: 0, restricted: 1 }
end
