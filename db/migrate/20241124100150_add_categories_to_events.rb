class AddCategoriesToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :categories, :string
  end
end
