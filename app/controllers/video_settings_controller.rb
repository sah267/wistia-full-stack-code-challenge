class VideoSettingsController < ApplicationController
  def index
    video_ids = params[:video_ids]
    settings = VideoSetting.where(video_id: video_ids.split(','))
    render json: settings
  end

  def update
    setting = VideoSetting.find_or_create_by(video_id: params[:id])
    setting.update(visible: params[:visible])
  end
end