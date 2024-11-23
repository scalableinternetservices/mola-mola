class AddStatusToRsvps < ActiveRecord::Migration[7.1]
  def change
    add_column :rsvps, :status, :string
  end
end
