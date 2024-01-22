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

def create_empty_map():
    return [[0 for _ in range(HEIGHT)] for _ in range(WIDTH)]

def draw_map(screen, game_map):
    for x in range(WIDTH):
        for y in range(HEIGHT):
            tile = game_map[x][y]
            color = (255, 255, 255)
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

            pygame.draw.rect(screen, color, (x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def draw_player(screen, position):
    player_radius = TILE_SIZE // 2
    player_center = (position[0] * TILE_SIZE + player_radius, position[1] * TILE_SIZE + player_radius)
    pygame.draw.circle(screen, PLAYER, player_center, player_radius)

def move_player(game_map, current_position, direction):
    # Calculate the new position based on the direction
    new_position = [current_position[0] + direction[0], current_position[1] + direction[1]]

    # Check if the new position is a valid move
    if 0 <= new_position[0] < WIDTH and 0 <= new_position[1] < HEIGHT and game_map[new_position[0]][new_position[1]] != BLACK:
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
    
    player_position = [10, 2]  # Initial player position
    player_direction = [0, 0]  # Initial player direction
    key_pressed = False

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

        if key_pressed:
            # Move the player dot one step
            player_position = move_player(game_map, player_position, player_direction)

        screen.fill((255, 255, 255))  # Set background color to white
        draw_map(screen, game_map)
        draw_player(screen, player_position)
        pygame.display.flip()

        pygame.time.Clock().tick(30)  # Limit the frame rate to 30 FPS

    pygame.quit()

if __name__ == "__main__":
    main()
