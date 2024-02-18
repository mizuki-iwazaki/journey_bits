class Inquiry < ApplicationRecord
  validates :name, presence: true, length: { maximum: 20 }
  validates :email, presence: true, length: { maximum: 30 }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :content, presence: true, length: { maximum: 500 }
end
