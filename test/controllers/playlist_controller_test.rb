require 'test_helper'

class PlaylistControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get playlist_path
    assert_response :success
  end
end
