class RemoveEventIdFromFollows < ActiveRecord::Migration[7.1]
  def change
    remove_column :follows, :event_id, :bigint
  end
end
