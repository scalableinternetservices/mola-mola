class AddCascadeDeleteToRsvps < ActiveRecord::Migration[7.1]
  def change
    # Remove the existing foreign key
    remove_foreign_key :rsvps, :events

    # Add a new foreign key with `ON DELETE CASCADE`
    add_foreign_key :rsvps, :events, on_delete: :cascade
  end
end
