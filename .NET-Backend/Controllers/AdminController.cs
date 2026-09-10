using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareAPI.Models;
using HealthcareAPI.Data;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using HealthcareAPI.DTOs;  // ← ADD THIS USING STATEMENT

namespace HealthcareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // GET: api/Admin
        // ============================================
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Admin>>> GetAdmins()
        {
            try
            {
                var admins = await _context.Admins
                    .OrderBy(a => a.Name)
                    .Select(a => new
                    {
                        a.AdminID,
                        a.Name,
                        a.Username,
                        a.Contact
                    })
                    .ToListAsync();

                return Ok(admins);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching admins: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // GET: api/Admin/5
        // ============================================
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Admin>> GetAdmin(int id)
        {
            try
            {
                var admin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.AdminID == id);

                if (admin == null)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                return Ok(admin);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching admin: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // POST: api/Admin
        // ============================================
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Admin>> CreateAdmin([FromBody] CreateAdminDTO dto)
        {
            try
            {
                Console.WriteLine($"📝 Creating admin: {dto.Name}");

                // Check if username already exists
                var existingAdmin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.Username == dto.Username);

                if (existingAdmin != null)
                {
                    return BadRequest("Username already exists");
                }

                var admin = new Admin
                {
                    Name = dto.Name,
                    Username = dto.Username,
                    Contact = dto.Contact ?? "N/A",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)  // ← NOW WORKS
                };

                _context.Admins.Add(admin);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Admin created with ID: {admin.AdminID}");

                return CreatedAtAction(nameof(GetAdmin), new { id = admin.AdminID }, admin);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating admin: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // PUT: api/Admin/5
        // ============================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAdmin(int id, [FromBody] UpdateAdminDTO dto)
        {
            try
            {
                var admin = await _context.Admins.FindAsync(id);
                if (admin == null)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                if (!string.IsNullOrEmpty(dto.Name))
                    admin.Name = dto.Name;

                if (!string.IsNullOrEmpty(dto.Username))
                {
                    var existing = await _context.Admins
                        .FirstOrDefaultAsync(a => a.Username == dto.Username && a.AdminID != id);
                    if (existing != null)
                    {
                        return BadRequest("Username already exists");
                    }
                    admin.Username = dto.Username;
                }

                if (!string.IsNullOrEmpty(dto.Contact))
                    admin.Contact = dto.Contact;

                if (!string.IsNullOrEmpty(dto.Password))
                    admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);  // ← NOW WORKS

                await _context.SaveChangesAsync();

                return Ok(new { message = "Admin updated successfully", admin });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating admin: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================
        // DELETE: api/Admin/5
        // ============================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            try
            {
                var admin = await _context.Admins.FindAsync(id);
                if (admin == null)
                {
                    return NotFound($"Admin with ID {id} not found");
                }

                _context.Admins.Remove(admin);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Admin deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting admin: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
