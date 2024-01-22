import pygame
import sys

# Constants
WIDTH, HEIGHT = 25, 25
TILE_SIZE = 10  # Adjust this to change the size of each tile

# Colors
WHITE = 0
BLACK = 1  # Wall
PURPLE = 2  # Barrier
RED = 3  # Stairs

def create_empty_map():
    return [[0 for _ in range(WIDTH)] for _ in range(HEIGHT)]

def draw_map(screen, game_map):
    for x in range(WIDTH):
        for y in range(HEIGHT):
            tile = game_map[y][x]
            if tile == WHITE:
                color = (255, 255, 255)
            elif tile == BLACK:
                color = (0, 0, 0)
            elif tile == PURPLE:
                color = (128, 0, 128)
            elif tile == RED:
                color = (255, 0, 0)

            pygame.draw.rect(screen, color, (x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE))
    pygame.display.set_caption("2D Map Generator")

    game_map = create_empty_map()

    # Manually set some pixels
    for x in range(25):
        game_map[0][x] = BLACK
        game_map[x][0] = BLACK
        game_map[x][24] = BLACK
        game_map[24][x] = BLACK
        game_map[12][x] = BLACK
    
    game_map[11][20] = BLACK
    game_map[11][22] = BLACK
    game_map[11][21] = RED
    
    game_map[23][20] = BLACK
    game_map[23][22] = BLACK
    game_map[23][21] = RED

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        screen.fill((255, 255, 255))  # Set background color to white
        draw_map(screen, game_map)
        pygame.display.flip()

        pygame.time.Clock().tick(30)  # Limit the frame rate to 30 FPS

if __name__ == "__main__":
    main()
