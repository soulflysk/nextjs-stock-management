using System.Text.Json;
using StackExchange.Redis;

namespace StockManagement.Api.Services;

public class RedisCacheService(IConnectionMultiplexer redis)
{
    private readonly IDatabase _db = redis.GetDatabase();

    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _db.StringGetAsync(key);
        return value.IsNullOrEmpty ? default : JsonSerializer.Deserialize<T>(value!);
    }

    public Task SetAsync<T>(string key, T value, TimeSpan ttl) =>
        _db.StringSetAsync(key, JsonSerializer.Serialize(value), ttl);

    public Task RemoveAsync(string key) => _db.KeyDeleteAsync(key);
}
