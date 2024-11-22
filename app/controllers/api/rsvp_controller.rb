modulde Api
    class RsvpController < ApplicationController
        
        # GET /api/rsvps
        # Return the list of all RSVPs *for the current user*, requires authentication
        # Success: return the list of all RSVPs
        def index
            @rsvps = Rsvp.where(user_id: @user.id)
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
            # Check if the event exists 
            unless Event.exists?(rsvp_params[:event_id])
                return render(json: { error: 'Event does not exist' }, status: :not_found)
            end

            # Check if the RSVP exists
            old_rsvp = Rsvp.find_by(user_id: rsvp_params[:user_id], event_id: rsvp_params[:event_id]) # TODO: return nil if not found? Should check documentation
            unless old_rsvp.nil?
                return render(json: { error: 'RSVP already exists', rsvp_id: old_rsvp.id }, status: :bad_request)
            end

            # If not, create the RSVP
            rsvp = Rsvp.new(rsvp_params)
            if rsvp.save
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
            begin
                rsvp = Rsvp.find(params[:id])
                if rsvp.user_id == @user.id
                    rsvp.update(rsvp_params)
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
            params.require(:rsvp).permit(:response, :event_id)
        end
    end
