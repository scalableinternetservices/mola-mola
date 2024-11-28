module Api
  class RsvpsController < ApplicationController
    # If :user_id present in params (which means requesting to /api/users/:user_id/invites), set @user to the user with that ID
    before_action :set_active_user, if: -> { params[:user_id].present? }
    # If :status present in params (which means requesting with ?status=accepted/declined), validate the status
    before_action :validate_status, if: -> { params[:status].present? }
        
    # # GET /api/rsvps
    # # Return the list of all RSVPs by the user with the given ID, requires authentication
    # # Success: return the list of all RSVPs
    # def index
    #   query_params = params.permit(:status, :event_id)
    #   query_params[:user_id] = @active_user.id

    #   @rsvps = Rsvp.where(query_params)
    #   # unless params[:status].nil?
    #   #   @rsvps = Rsvp.where(user_id: @active_user.id, response: params[:status])
    #   # else
    #   #   @rsvps = Rsvp.where(user_id: @active_user.id)
    #   # end
    #   render json: @rsvps, status: :ok
    # end

    # Add the new action for fetching RSVPs by event and status
    def index
      query_params = params.permit(:event_id, :status)

      # Ensure both event_id and status are present
      unless query_params[:event_id].present? && query_params[:status].present?
        return render json: { error: 'event_id and status are required' }, status: :bad_request
      end

      # Validate the status
      unless %w[accepted declined].include? query_params[:status]
        return render json: { error: 'Invalid status in request' }, status: :bad_request
      end

      # Query RSVPs for the given event and status
      rsvps = Rsvp.where(event_id: query_params[:event_id], status: query_params[:status])

      render json: rsvps, status: :ok
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

    # GET /api/rsvps/count
    # Return the number of RSVPs in the given time range, requires authentication 
    def count
      query_params = params.permit(:since, :until, :user_id)
      
      final_hash = Hash.new
      end_date = Date.parse(query_params[:until]) rescue Date.today
      start_date = Date.parse(query_params[:since]) rescue Date.today - 30.days
      user_id = query_params[:user_id] || @user.id

      (start_date..end_date).each do |date|
        beginning_time = date.beginning_of_day
        end_time = date.end_of_day

        rsvp_count_per_date = Rsvp.where(
          user_id: user_id, created_at: beginning_time..end_time).count
        if rsvp_count_per_date > 0
          final_hash[date] = rsvp_count_per_date
        end
      end

      render json: final_hash
    end

    # POST /api/rsvps
    # Create a new RSVP, requires authentication
    # Success: return the new RSVP
    #   RSVP already exists: return 400 Bad Request
    #   Event does not exist: return 404 Not Found
    #   Saving failed: return 400 Bad Request
    def create
      create_params = params.permit(:status, :event_id)
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
        # For each follower of the user on this event, create / update an RSVP for them
        followers = @user.followers_on_event(rsvp.event_id)
        create_or_update_rsvp_for(followers, rsvp.event_id, rsvp.status)
        render json: rsvp, status: :created
      else
        render json: { error: 'Invalid response' }, status: :bad_request
      end
    end


    # PUT /api/rsvps
    # Modify an RSVP based on event_id and user_id, requires authentication
    # Success: return the updated RSVP
    #   RSVP does not exist: return 404 Not Found
    #   Event does not exist: return 404 Not Found
    #   Update failed: return 400 Bad Request
    def update
      update_params = params.permit(:event_id, :status)
    
      # Ensure event_id is provided
      unless update_params[:event_id].present?
        return render json: { error: 'event_id is required' }, status: :bad_request
      end
    
      # Check if the event exists
      unless Event.exists?(update_params[:event_id])
        return render json: { error: 'Event does not exist' }, status: :not_found
      end
    
      # Find the RSVP by event_id and the current user's id
      rsvp = Rsvp.find_by(event_id: update_params[:event_id], user_id: @user.id)
      unless rsvp
        return render json: { error: 'RSVP not found' }, status: :not_found
      end
    
      # Update the RSVP
      if rsvp.update(update_params)
        # Update RSVPs for followers if the status changes
        followers = @user.followers_on_event(rsvp.event_id)
        create_or_update_rsvp_for(followers, rsvp.event_id, rsvp.status)
        render json: rsvp, status: :ok
      else
        render json: { error: 'Invalid update' }, status: :bad_request
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
    
    # DELETE /api/rsvps
    # Delete the RSVP based on event_id, requires authentication
    # Success: return a message 'RSVP deleted'
    #   RSVP does not exist: return 404 Not Found
    #   Unauthorized: return 401 Unauthorized
    #   Deletion failed: return 400 Bad Request
    def destroy
      delete_params = params.permit(:event_id)
    
      # Ensure event_id is provided
      unless delete_params[:event_id].present?
        return render json: { error: 'event_id is required' }, status: :bad_request
      end
    
      # Find the RSVP to delete
      rsvp = Rsvp.find_by(event_id: delete_params[:event_id], user_id: @user.id)
      unless rsvp
        return render json: { error: 'RSVP not found' }, status: :not_found
      end
    
      # Check ownership
      unless rsvp.user_id == @user.id
        return render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    
      # Attempt to delete the RSVP
      if rsvp.destroy
        render json: { message: 'RSVP deleted' }, status: :ok
      else
        render json: { error: 'Failed to delete RSVP' }, status: :bad_request
      end
    end
    

    private

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

    def create_or_update_rsvp_for(followers, event_id, status)
      followers.each do |follower|
        follower_old_rsvp = Rsvp.find_by(user_id: follower.id, event_id: event_id)
        if follower_old_rsvp.nil?
          follower_rsvp = Rsvp.new(
            user_id: follower.id,
            event_id: event_id,
            status: status
          )
          follower_rsvp.save
        else
          follower_old_rsvp.update(status: status)
        end
      end
    end
  end
end
