class CreateVideoSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :video_settings do |t|
      t.boolean :visible, default: true
      t.integer :video_id

      t.timestamps
    end
  end
end
