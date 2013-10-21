class CreateBackgrounds < ActiveRecord::Migration
  def change
    create_table :backgrounds do |t|
      t.string "name"
      t.string "file_url"
      t.timestamps
    end
  end
end
