class UserSerializer
  include FastJsonapi::ObjectSerializer
  set_type :user
  attributes :id, :name, :email

end
