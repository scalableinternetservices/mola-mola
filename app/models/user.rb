class User < ApplicationRecord
    has_secure_password

    validates :username, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
    validates :password, presence: true, length: { minimum: 6 }
    validates :privacy, inclusion: { in: %w[public private], message: "%{value} is not a valid privacy setting" }
    has_many :hosted_events, class_name: "Event", foreign_key: "host_id"

    has_many :rsvps
    has_many :paritipated_events, through: :rsvps, source: :event

    has_many :follows, foreign_key: "follower_id"
    has_many :followed_users, through: :follows, source: :followee
    has_many :followers, through: :follows, source: :follower

    scope :public, -> { where(privacy: 'public') }
    def as_json(option = {})
      super(option).except('password_digest', 'created_at', 'updated_at', 'privacy')
    end

    def followers_on_event(event_id)
      followers.joins(:rsvps).where(rsvps: { event_id: event_id }).select(:id, :username)
    end
end
