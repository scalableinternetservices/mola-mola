class AddPrivacyToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :privacy, :string, null: false, default: 'public'
  end
end

