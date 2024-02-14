import pygame
import math

# Constants
WIDTH, HEIGHT = 25, 25
TILE_SIZE = 20  # Adjust this to change the size of each tile

# Colors
WHITE = 0
BLACK = 1  # Wall
PURPLE = 2  # Barrier
RED = 3  # Stairs
GREEN = 4  # START
BLUE = 5  # Kontroll
PLAYER = (255, 255, 0)  # Player dot color (Yellow)
CONTROL_POINT = 6  # Blue dots

# Add this line at the beginning to initialize the path array
path = []

def create_empty_map():
    return [[0 for _ in range(HEIGHT)] for _ in range(WIDTH)]

def draw_map(screen, game_map, path, show_path):
    for x in range(WIDTH):
        for y in range(HEIGHT):
            tile = game_map[x][y]
            color = (255, 255, 255)
            
            # Check if the tile is part of the path and control points have been passed
            if show_path and (x, y) in path:
                # Draw a circle for the path with the same color as the player
                player_radius = TILE_SIZE // 2
                player_center = (x * TILE_SIZE + player_radius, y * TILE_SIZE + player_radius)
                pygame.draw.circle(screen, PLAYER, player_center, player_radius)
            else:
                if tile == BLACK:
                    color = (0, 0, 0)
                elif tile == PURPLE:
                    color = (128, 0, 128)
                elif tile == RED:
                    color = (255, 0, 0)
                elif tile == GREEN:
                    color = (0, 255, 0)
                elif tile == BLUE:
                    color = (0, 0, 255)
                elif tile == PLAYER:
                    color = PLAYER

                pygame.draw.rect(screen, color, (x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def draw_player(screen, position):
    player_radius = TILE_SIZE // 2
    player_center = (position[0] * TILE_SIZE + player_radius, position[1] * TILE_SIZE + player_radius)
    pygame.draw.circle(screen, PLAYER, player_center, player_radius)

def move_player(game_map, current_position, direction, control_points, path):
    # Calculate the new position based on the direction
    new_position = [current_position[0] + direction[0], current_position[1] + direction[1]]

    # Check if the new position is a valid move
    if 0 <= new_position[0] < WIDTH and 0 <= new_position[1] < HEIGHT and game_map[new_position[0]][new_position[1]] != BLACK:
        # Check for teleportation points
        if new_position == [11, 21]:
            return [23, 21]
        elif new_position == [23, 21]:
            return [11, 21]
        else:
            # Check for control points
            if game_map[new_position[0]][new_position[1]] == CONTROL_POINT:
                control_points.append(new_position)
                game_map[new_position[0]][new_position[1]] = 0  # Remove the blue dot from the map
            elif game_map[new_position[0]][new_position[1]] == BLUE:
                game_map[new_position[0]][new_position[1]] = WHITE  # Turn the blue tile to white
            
            # Update the path array
            path.append(tuple(new_position))
            
            return new_position
    else:
        return current_position

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE))
    pygame.display.set_caption("2D Map Generator")

    game_map = create_empty_map()

    # Manually set some pixels
    for y in range(25):
        game_map[0][y] = BLACK
        game_map[y][0] = BLACK
        game_map[y][24] = BLACK
        game_map[24][y] = BLACK
        game_map[12][y] = BLACK
    
    game_map[11][20] = BLACK
    game_map[11][22] = BLACK
    game_map[11][21] = RED
    
    game_map[23][20] = BLACK
    game_map[23][22] = BLACK
    game_map[23][21] = RED
    
    game_map[10][2] = GREEN  # START
    
    for x in range(4, 12):
        game_map[x][4] = BLACK
    
    for x in range(0, 9):
        game_map[x][8] = BLACK
    
    game_map[10][6] = BLUE
    game_map[16][4] = BLUE
    
    player_position = [10, 2]  # Initial player position
    player_direction = [0, 0]  # Initial player direction
    key_pressed = False

    control_points = []  # List to store passed control points
    all_control_points_passed = False

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                key_pressed = True
                if event.key == pygame.K_UP:
                    player_direction[1] = -1
                elif event.key == pygame.K_DOWN:
                    player_direction[1] = 1
                elif event.key == pygame.K_LEFT:
                    player_direction[0] = -1
                elif event.key == pygame.K_RIGHT:
                    player_direction[0] = 1
            elif event.type == pygame.KEYUP:
                key_pressed = False
                player_direction = [0, 0]

        if not all_control_points_passed and key_pressed:
            # Move the player dot one step
            player_position = move_player(game_map, player_position, player_direction, control_points, path)

        screen.fill((255, 255, 255))  # Set background color to white
        # Pass a boolean flag to indicate whether to show the path
        draw_map(screen, game_map, path, all_control_points_passed)
        draw_player(screen, player_position)

        # Draw the trail of the player's movement
        for point in control_points:
            pygame.draw.circle(screen, PLAYER, (point[0] * TILE_SIZE + TILE_SIZE // 2, point[1] * TILE_SIZE + TILE_SIZE // 2), TILE_SIZE // 2)

        pygame.display.flip()

        pygame.time.Clock().tick(30)  # Limit the frame rate to 30 FPS

        # Check if all control points are passed
        if len(control_points) == sum(row.count(BLUE) for row in game_map):
            all_control_points_passed = True

    # Move the "All control points passed!" message outside the main loop
    print("All control points passed!")
    pygame.quit()

if __name__ == "__main__":
    main()
