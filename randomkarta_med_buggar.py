import pygame
import random
import heapq

# Constants
WIDTH, HEIGHT = 800, 600
GRID_SIZE = 75
CELL_SIZE = WIDTH // GRID_SIZE

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
YELLOW = (255, 255, 0)  # Yellow color for the end node

class Node:
    def __init__(self, row, col):
        self.row = row
        self.col = col
        self.is_wall = False
        self.is_start = False
        self.is_end = False
        self.is_path = False
        self.distance = float('inf')
        self.prev = None

    def __lt__(self, other):
        return self.distance < other.distance

    def draw(self, screen):
        color = WHITE
        if self.is_wall:
            color = BLACK
        elif self.is_start:
            color = RED
        elif self.is_end:
            color = YELLOW
        elif self.is_path:
            color = BLUE
        pygame.draw.rect(screen, color, (self.col * CELL_SIZE, self.row * CELL_SIZE, CELL_SIZE, CELL_SIZE))

class Player:
    def __init__(self, start_node):
        self.row = start_node.row
        self.col = start_node.col

    def move(self, direction, grid):
        new_row, new_col = self.row, self.col

        if direction == "UP" and self.row > 0:
            new_row -= 1
        elif direction == "DOWN" and self.row < GRID_SIZE - 1:
            new_row += 1
        elif direction == "LEFT" and self.col > 0:
            new_col -= 1
        elif direction == "RIGHT" and self.col < GRID_SIZE - 1:
            new_col += 1

        if 0 <= new_row < GRID_SIZE and 0 <= new_col < GRID_SIZE and not grid[new_row][new_col].is_wall:
            self.row, self.col = new_row, new_col

    def draw(self, screen):
        pygame.draw.circle(screen, BLUE, (self.col * CELL_SIZE + CELL_SIZE // 2, self.row * CELL_SIZE + CELL_SIZE // 2), CELL_SIZE // 2)
def generate_map():
    # Initialize the grid with nodes
    grid = [[Node(row, col) for col in range(GRID_SIZE)] for row in range(GRID_SIZE)]

    # Set start node on a non-wall position
    start_row, start_col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)
    start_node = grid[start_row][start_col]
    while start_node.is_wall:
        start_row, start_col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)
        start_node = grid[start_row][start_col]
    start_node.is_start = True

    # Set end node on a non-wall position
    end_row, end_col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)
    end_node = grid[end_row][end_col]
    while end_node.is_wall or end_node.is_start:
        end_row, end_col = random.randint(0, GRID_SIZE - 1), random.randint(0, GRID_SIZE - 1)
        end_node = grid[end_row][end_col]
    end_node.is_end = True

    # Generate walls randomly
    for _ in range(GRID_SIZE * GRID_SIZE // 4):
        row = random.randint(0, GRID_SIZE - 1)
        col = random.randint(0, GRID_SIZE - 1)
        node = grid[row][col]
        node.is_wall = True

    return grid, start_node, end_node

def draw_grid(screen, grid, player):
    for row in grid:
        for node in row:
            node.draw(screen)
            if node.is_start:
                pygame.draw.rect(screen, RED, (node.col * CELL_SIZE, node.row * CELL_SIZE, CELL_SIZE, CELL_SIZE))
            elif node.is_end:
                pygame.draw.rect(screen, YELLOW, (node.col * CELL_SIZE, node.row * CELL_SIZE, CELL_SIZE, CELL_SIZE))
    player.draw(screen)
    pygame.display.flip()

def dijkstra(grid, start, end):
    heap = [(0, start)]
    while heap:
        curr_distance, curr_node = heapq.heappop(heap)
        if curr_node.is_path:
            continue
        curr_node.is_path = True
        if curr_node == end:
            return

        for neighbor in get_neighbors(grid, curr_node):
            new_distance = curr_distance + 1  # Assuming all edges have equal weight
            if new_distance < neighbor.distance:
                neighbor.distance = new_distance
                neighbor.prev = curr_node
                heapq.heappush(heap, (new_distance, neighbor))

def get_neighbors(grid, node):
    neighbors = []
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    for dr, dc in directions:
        row, col = node.row + dr, node.col + dc
        if 0 <= row < GRID_SIZE and 0 <= col < GRID_SIZE and not grid[row][col].is_wall:
            neighbors.append(grid[row][col])
    return neighbors

def reconstruct_path(end_node):
    path = []
    current = end_node
    while current:
        path.insert(0, current)
        current = current.prev
    return path

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Map Generator")

    grid, start_node, end_node = generate_map()
    player = Player(start_node)

    while grid[player.row][player.col].is_wall:
        player = Player(start_node)

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    player.move("UP", grid)
                elif event.key == pygame.K_DOWN:
                    player.move("DOWN", grid)
                elif event.key == pygame.K_LEFT:
                    player.move("LEFT", grid)
                elif event.key == pygame.K_RIGHT:
                    player.move("RIGHT", grid)

        draw_grid(screen, grid, player)

        if player.row == end_node.row and player.col == end_node.col:
            print("Congratulations! You reached the goal.")
            dijkstra(grid, start_node, end_node)
            shortest_path = reconstruct_path(end_node)
            for node in shortest_path:
                node.is_path = False
            for node in shortest_path:
                node.is_path = True
                draw_grid(screen, grid, player)
                pygame.time.delay(300)

    pygame.quit()

if __name__ == "__main__":
    main()
