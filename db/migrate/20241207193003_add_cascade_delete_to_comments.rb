class AddCascadeDeleteToComments < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :comments, :events
    add_foreign_key :comments, :events, on_delete: :cascade
  end
end
