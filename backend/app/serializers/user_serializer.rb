class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user
  attributes :id, :name, :email

  has_many :posts
  has_many :themes
end
