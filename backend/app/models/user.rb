class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :api_keys
  has_many :posts
  has_many :themes
  has_many :likes
  has_many :bookmarks
  has_many :images, through: :posts

  mount_uploader :avatar, AvatarUploader

  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  validates :email, uniqueness: true, presence: true
  validates :name, presence: true, length: { maximum: 255 }

  enum role: { user: 0, admin: 1, guest: 2 }

  def activate_api_key!
    return api_keys.active.first if api_keys.active.exists?

    api_keys.create
  end

  def deactivate_api_key!
    api_key = self.api_keys.active.first
    api_key&.deactivate!
  end

  def security_answer=(answer)
    self.security_answer_digest = BCrypt::Password.create(answer)
  end

  # 提供された回答が正しいか検証
  def authenticate_security_question_and_answer(question, answer)
    self.security_question == question && BCrypt::Password.new(self.security_answer_digest) == answer
  end

  def reset_password(new_password, new_password_confirmation)
    self.password = new_password
    self.password_confirmation = new_password_confirmation

    if save
      true
    else
      false
    end
  end

  def guest?
    role === 'guest'
  end
end
