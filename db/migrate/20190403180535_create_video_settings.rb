class CreateVideoSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :video_settings do |t|
      t.boolean :visible, default: true
      t.integer :video_id

      t.timestamps

      t.index ['video_id'], name: 'index_video_settings_on_video_id', unique: true
    end
  end
end
