import pygame
import sys

# Constants
WIDTH, HEIGHT = 25, 25
TILE_SIZE = 10  # Adjust this to change the size of each tile

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

def create_empty_map():
    return [[0 for _ in range(WIDTH)] for _ in range(HEIGHT)]

def draw_map(screen, game_map):
    for y, row in enumerate(game_map):
        for x, tile in enumerate(row):
            color = WHITE if tile == 0 else BLACK
            pygame.draw.rect(screen, color, (x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH * TILE_SIZE, HEIGHT * TILE_SIZE))
    pygame.display.set_caption("2D Map Generator")

    game_map = create_empty_map()

    # Manually set some pixels to black (1)
    
    
    
    for x in range(0,25):
        game_map[x][0] = 1
        game_map[0][x] = 1
        game_map[24][x] = 1
        game_map[x][24] = 1
        game_map[x][12] = 1
    
        
        
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        screen.fill(WHITE)
        draw_map(screen, game_map)
        pygame.display.flip()

        pygame.time.Clock().tick(30)  # Limit the frame rate to 30 FPS

if __name__ == "__main__":
    main()
