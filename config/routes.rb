Rails.application.routes.draw do
  get 'playlist' => 'playlist#index'
  get 'dashboard' => 'dashboard#index'
  resources :video_settings, only: [:index, :update]
end
