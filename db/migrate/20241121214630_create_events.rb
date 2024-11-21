class CreateEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.string :title
      t.datetime :date
      t.references :host, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
