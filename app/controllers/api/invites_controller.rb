module Api
  class InvitesController < ApplicationController
    # If :user_id present in params (which means requesting to /api/users/:user_id/invites), set @user to the user with that ID
    before_action :set_active_user, if: -> { params[:user_id].present? }
    # If :status present in params (which means requesting with ?status=pending/accepted/declined), validate the status
    before_action :validate_status, if: -> { params[:status].present? }, only: [:sent, :received]

    # GET /api/users/:user_id/invites/sent
    # Return the list of all invites sent by the user with the given ID, requires authentication
    # Success: return the list of all invites
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def sent
      unless params[:status].nil?
        @sent_invites = Invite.where(inviter_id: @active_user.id, status: params[:status])
      else
        @sent_invites = Invite.where(inviter_id: @active_user.id)                
      end
      render json: @sent_invites, status: :ok
    end

    # GET /api/users/:user_id/invites/received
    # Return the list of all invites received by the user with the given ID, requires authentication
    # Success: return the list of all invites
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def received
      unless params[:status].nil?
        @received_invites = Invite.where(invitee_id: @active_user.id, status: params[:status])                
      else
        @received_invites = Invite.where(invitee_id: @active_user.id)
      end
      render json: @received_invites, status: :ok
    end

    # POST /api/invites/:id/accept
    # Accept the invite with the given ID, requires authentication
    def accept
      handle_invite_update('accepted', 'Accepting')
    end

    # POST /api/invites/:id/decline
    # Decline the invite with the given ID, requires authentication
    def decline
      handle_invite_update('declined', 'Declining')
    end

    # GET /api/invites/:id
    # Return the invite with the given ID, requires authentication
    # Success: return the invite
    #   Invite does not belong to the current user: return 401 Unauthorized
    #   Invite not found: return 404 Not Found
    def show
      begin 
        invite = Invite.find(params[:id])
        if invite.user_id == @user.id
          render json: invite, status: :ok
        else
          render json: { error: 'Looking at someone else\'s invite' }, status: :unauthorized
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Invite not found' }, status: :not_found
      end
    end

    # POST /api/invites
    # Create a new invite, requires authentication
    # Success: return the new invite
    #   Invite already exists: return 400 Bad Request
    #   Event does not exist: return 404 Not Found
    #   Saving failed: return 400 Bad Request
    def create
      create_params = params.require(:invite).permit(:event_id, :invitee_id)
      create_params[:inviter_id] = @user.id

      # Check if the event exists
      unless Event.exists?(create_params[:event_id])
        return render(json: { error: 'Event does not exist' }, status: :not_found)
      end

      # Check if the invite exists
      old_invite = Invite.find_by(
        inviter_id: @user.id,
        event_id: create_params[:event_id],
        invitee_id: create_params[:invitee_id])
      unless old_invite.nil?
        return render(json: { error: 'Invite already exists', invite_id: old_invite.id }, status: :bad_request)
      end

      # If not, create the invite
      invite = Invite.new(create_params)
      if invite.save
        render json: invite, status: :created
      else
        render json: { error: 'Invalid response' }, status: :bad_request
      end
    end

    private

    def handle_invite_update(new_status, predicate)
      begin
        invite = Invite.find(params[:id])
        unless invite.invitee_id == @user.id
          return render(json: { error: "#{predicate} someone else's invite" }, status: :forbidden)
        end
        unless invite.status == 'pending'
          return render(json: { error: 'Invite not pending' }, status: :bad_request)
        end
        invite.update(status: new_status)
          
        # Create an RSVP / update an existing RSVP for the user
        existing_rsvp = Rsvp.find_by(user_id: @user.id, event_id: invite.event_id)
        if existing_rsvp.nil?
          rsvp = Rsvp.new(user_id: @user.id, event_id: invite.event_id, status: new_status)
          rsvp.save
        else
          existing_rsvp.update(status: new_status)
        end

        render json: invite, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Invite not found' }, status: :not_found
      end
    end

    def set_active_user
      @active_user = User.find_by(id: params[:user_id])
      # Make sure that the user exists...
      unless @active_user
        render json: { error: 'User not found' }, status: :not_found
      end
      # And that it's the authenticated user
      unless @active_user.id == @user.id
        render json: { error: 'Unauthorized to view these invites' }, status: :unauthorized
      end
    end

    def validate_status
      unless %w[pending accepted declined].include? params[:status]
        render json: { error: 'Invalid status in request' }, status: :bad_request
      end
    end
  end
end