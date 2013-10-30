class CreateThemesBackgroundsJoin < ActiveRecord::Migration
  def change
    create_table :backgrounds_themes, :id => false do |t|
       t.integer "background_id"
       t.integer "theme_id"
    end
    add_index :backgrounds_themes, ["background_id","theme_id"]
  end
end
