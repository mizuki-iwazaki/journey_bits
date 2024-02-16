class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user
  attributes :id, :name, :email, :avatar

  attribute :avatar do |user|
    user.avatar.url
  end

  has_many :posts
  has_many :themes
end
