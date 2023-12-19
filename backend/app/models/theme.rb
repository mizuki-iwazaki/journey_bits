class Theme < ApplicationRecord
  has_many :posts
  belongs_to :user

  validates :name, presence: true
  validates :name, uniqueness: { case_sensitive: false }
  validates :name, length: { in: 5..100 }
end
