class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :api_keys
  has_many :posts
  has_many :themes

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  validates :email, uniqueness: true, presence: true
  validates :name, presence: true, length: { maximum: 255 }

  enum role: { user: 0, admin: 1 }

  def activate_api_key!
    return api_keys.active.first if api_keys.active.exists?

    api_keys.create
  end

  def deactivate_api_key!
    api_key = self.api_keys.active.first
    api_key&.deactivate!
  end
end
