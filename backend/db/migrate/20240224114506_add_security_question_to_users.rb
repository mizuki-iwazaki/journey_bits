class AddSecurityQuestionToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :security_question, :string
    add_column :users, :security_answer_digest, :string
  end
end
