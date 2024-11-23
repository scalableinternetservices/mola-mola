class User < ApplicationRecord
    has_secure_password

    validates :email, presence: true, uniqueness: true
    validates :password, presence: true, length: { minimum: 6 }
    has_many :hosted_events, class_name: "Event", foreign_key: "host_id"

    has_many :rsvps
    has_many :paritipated_events, through: :rsvps
end
