module Api
    class RsvpsController < ApplicationController
        # If :user_id present in params (which means requesting to /api/users/:user_id/invites), set @user to the user with that ID
        before_action :set_active_user, if: -> { params[:user_id].present? }
        # If :status present in params (which means requesting with ?status=accepted/declined), validate the status
        before_action :validate_status, if: -> { params[:status].present? }
        
        # GET /api/users/:user_id/rsvps
        # Return the list of all RSVPs by the user with the given ID, requires authentication
        # Success: return the list of all RSVPs
        def index
            unless params[:status].nil?
                @rsvps = Rsvp.where(user_id: @active_user.id, response: params[:status])
            else
                @rsvps = Rsvp.where(user_id: @active_user.id)
            end
            render json: @rsvps, status: :ok
        end

        # GET /api/rsvps/:id
        # Return the RSVP with the given ID, requires authentication
        # Success: return the RSVP
        #   RSVP does not belong to the current user: return 401 Unauthorized
        #   RSVP not found: return 404 Not Found
        def show
            begin
                rsvp = Rsvp.find(params[:id])
                if rsvp.user_id == @user.id
                    render json: rsvp, status: :ok
                else # TODO: look at the other user's privacy settings to see if the current user can see this RSVP
                    render json: { error: 'Looking at someone else\'s RSVP' }, status: :unauthorized
                end
            rescue ActiveRecord::RecordNotFound
                render json: { error: 'RSVP not found' }, status: :not_found
            end
        end

        # POST /api/rsvps
        # Create a new RSVP, requires authentication
        # Success: return the new RSVP
        #   RSVP already exists: return 400 Bad Request
        #   Event does not exist: return 404 Not Found
        #   Saving failed: return 400 Bad Request
        def create
            create_params = params.require(:rsvp).permit(:status, :event_id)
            create_params[:user_id] = @user.id

            # Check if the event exists 
            unless Event.exists?(create_params[:event_id])
                return render(json: { error: 'Event does not exist' }, status: :not_found)
            end

            # Check if the RSVP exists
            old_rsvp = Rsvp.find_by(user_id: create_params[:user_id], event_id: create_params[:event_id])
            unless old_rsvp.nil?
                return render(json: { error: 'RSVP already exists', rsvp_id: old_rsvp.id }, status: :bad_request)
            end

            # If not, create the RSVP
            rsvp = Rsvp.new(create_params)
            if rsvp.save
                # TODO: create/update RSVP for followers on this (followee, event) pair
                render json: rsvp, status: :created
            else
                render json: { error: 'Invalid response' }, status: :bad_request
            end
        end

        # PUT /api/rsvps/:id
        # Modify the RSVP with the given ID, requires authentication
        # Success: return the updated RSVP
        #   RSVP does not belong to the current user: return 401 Unauthorized
        #   RSVP not found: return 404 Not Found
        #   Update failed: return 400 Bad Request
        def update
            update_params = params.require(:rsvp).permit(:status)
            begin
                rsvp = Rsvp.find(params[:id])
                if rsvp.user_id == @user.id
                    rsvp.update(update_params)
                    # TODO: create/update RSVP for followers on this (followee, event) pair
                    render json: rsvp, status: :ok
                else
                    render json: { error: 'Unauthorized' }, status: :unauthorized
                end
            rescue ActiveRecord::RecordNotFound
                render json: { error: 'RSVP not found' }, status: :not_found
            end
        end

        # DELETE /api/rsvps/:id
        # Delete the RSVP with the given ID, requires authentication
        # Success: return a message 'RSVP deleted'
        #  RSVP does not belong to the current user: return 401 Unauthorized
        #  RSVP not found: return 404 Not Found
        #  Delete failed: return 400 Bad Request
        def destroy
            begin
                rsvp = Rsvp.find(params[:id])
                if rsvp.user_id == @user.id
                    rsvp.destroy
                    render json: { message: 'RSVP deleted' }, status: :ok
                else
                    render json: { error: 'Unauthorized' }, status: :unauthorized
                end
            rescue ActiveRecord::RecordNotFound
                render json: { error: 'RSVP not found' }, status: :not_found
            end
        end

        private

        def rsvp_params
            params.require(:rsvp).permit(:status, :event_id)
        end

        def set_active_user
            @active_user = User.find_by(id: params[:user_id])
            # Make sure that the user exists...
            unless @active_user
                render json: { error: 'User not found' }, status: :not_found
            end
            # And that it's the authenticated user
            unless @active_user.id == @user.id
                render json: { error: 'Unauthorized to view these RSVPs' }, status: :unauthorized
            end
        end

        def validate_status
            unless %w[accepted declined].include? params[:status]
                render json: { error: 'Invalid status in request' }, status: :bad_request
            end
        end
    end
end
