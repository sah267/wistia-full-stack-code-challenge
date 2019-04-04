require 'test_helper'

class VideoSettingsControllerTest < ActionDispatch::IntegrationTest
  test '#index should return settings for specifed video in json format' do
    get video_settings_path, params: { video_ids: '1,2' }

    response_video_ids = JSON.parse(response.body).map { |setting| setting['video_id'] }

    assert_response :success
    assert_equal [1, 2].sort, response_video_ids.sort
  end

  test '#update should update the VideoSettings record for the given video_id' do
    patch video_setting_path(3), params: { visible: false }

    assert_response :success
    assert_equal false, VideoSetting.find_by(video_id: 3).visible
  end

  test '#update should create a VideoSettings record for the given video_id if none exist' do
    patch video_setting_path(5), params: { visible: true }

    assert_response :success
    assert_equal true, VideoSetting.find_by(video_id: 5).visible
  end
end
