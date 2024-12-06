class RemoveStatusFromFollows < ActiveRecord::Migration[7.1]
  def change
    remove_column :follows, :status, :string
  end
end
